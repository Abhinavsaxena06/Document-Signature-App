package com.abhinav.signature_app.service;

import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.model.Signature;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

@Service
public class PdfSigningService {

    public String signPdf(
            Document document,
            Signature signature,
            int pageNumber,
            float x,
            float y,
            float width,
            float height
    ) throws IOException {

        System.out.println("========== PDF SIGN START ==========");
        System.out.println("TEXT = " + signature.getText());
        System.out.println("HAS IMAGE = " + (signature.getImageBase64() != null));
        System.out.println("RAW COORDS => x=" + x + " y=" + y + " w=" + width + " h=" + height);

        PDDocument pdf = null;

        try {
            pdf = Loader.loadPDF(new File(document.getFilePath()));

            if (pageNumber <= 0 || pageNumber > pdf.getNumberOfPages()) {
                throw new RuntimeException("Invalid page number: " + pageNumber);
            }

            PDPage page = pdf.getPage(pageNumber - 1);
            float pageHeight = page.getMediaBox().getHeight();

            // ---------------- SIMPLE & STABLE MAPPING ----------------
            float pdfX = x;
            float pdfY = pageHeight - y - height;

            System.out.println("PDF COORDS => x=" + pdfX + " y=" + pdfY);

            PDImageXObject image = null;
            boolean hasImage = false;

            // ---------------- IMAGE ----------------
            if (signature.getImageBase64() != null && !signature.getImageBase64().isEmpty()) {
                try {
                    String base64 = signature.getImageBase64();

                    if (base64.contains(",")) {
                        base64 = base64.split(",")[1];
                    }

                    byte[] decoded = Base64.getDecoder().decode(base64);
                    image = PDImageXObject.createFromByteArray(pdf, decoded, "sig");
                    hasImage = true;

                } catch (Exception e) {
                    System.out.println("IMAGE DECODE FAILED: " + e.getMessage());
                }
            }

            try (PDPageContentStream cs = new PDPageContentStream(
                    pdf,
                    page,
                    PDPageContentStream.AppendMode.APPEND,
                    true,
                    true
            )) {

                // safety clamp
                if (pdfX < 0) pdfX = 10;
                if (pdfY < 0) pdfY = 10;

                // ---------------- DRAW IMAGE ----------------
                if (hasImage && image != null) {

                    cs.drawImage(
                            image,
                            pdfX,
                            pdfY,
                            width,
                            height
                    );

                    System.out.println("IMAGE DRAWN");
                }

                // ---------------- DRAW TEXT ----------------
                else {

                    String text = signature.getText();

                    if (text == null || text.trim().isEmpty()) {
                        text = "SIGNATURE";
                    }

                    cs.beginText();
                    cs.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD), 14);
                    cs.newLineAtOffset(pdfX, pdfY);
                    cs.showText(text);
                    cs.endText();

                    System.out.println("TEXT DRAWN");
                }
            }

            // ---------------- SAVE ----------------
            String dir = "C:/signed-pdfs";
            File folder = new File(dir);
            if (!folder.exists()) folder.mkdirs();

            String path = dir + File.separator + UUID.randomUUID() + "_signed.pdf";

            pdf.save(path);

            System.out.println("PDF SAVED => " + path);
            System.out.println("========== PDF SIGN END ==========");

            return path;

        } finally {
            if (pdf != null) {
                pdf.close();
            }
        }
    }
}