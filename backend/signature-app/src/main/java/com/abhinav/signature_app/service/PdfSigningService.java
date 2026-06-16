package com.abhinav.signature_app.service;

import com.abhinav.signature_app.model.Document;
import com.abhinav.signature_app.model.Signature;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class PdfSigningService {

    public String signPdf(
            Document document,
            Signature signature,
            int pageNumber,
            float x,
            float y
    ) throws IOException {

        PDDocument pdf =
                Loader.loadPDF(
                        new File(document.getFilePath())
                );

        PDPage page =
                pdf.getPage(pageNumber -1);

        PDImageXObject image =
                PDImageXObject.createFromFile(
                        signature.getSignaturePath(),
                        pdf
                );

        PDPageContentStream contentStream =
                new PDPageContentStream(
                        pdf,
                        page,
                        PDPageContentStream.AppendMode.APPEND,
                        true
                );

        contentStream.drawImage(
                image,
                x,
                y,
                150,
                75
        );

        contentStream.close();

        String signedDir = "C:/signed-pdfs";

        File directory = new File(signedDir);

        if (!directory.exists()) {
            directory.mkdirs();
        }
        String signedPath =
                signedDir
                        + File.separator
                        + UUID.randomUUID()
                        + "_signed.pdf";

        pdf.save(signedPath);

        pdf.close();

        return signedPath;
    }
}