# 🖊️ Document Signature App
![Java](https://img.shields.io/badge/Java-17-red?style=for-the-badge&logo=java)
![Spring Boot](https://img.shields.io/badge/SpringBoot-Backend-green?style=for-the-badge&logo=springboot)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)

A full-stack **Document Signature Web Application** that allows users to upload PDFs, add signatures, initials, and names dynamically, drag and position them on documents, and generate a final signed PDF that can be downloaded instantly. The system combines a **Spring Boot backend** for secure PDF processing with a **React frontend** for an interactive drag-and-drop signing experience.

The backend handles authentication, document storage, and PDF manipulation using Apache PDFBox, while the frontend provides a smooth UI where users can visually place signatures exactly where they want them. Each signature is stored, updated in real time, and synchronized with backend processing to ensure accurate placement in the final PDF output.

Users can upload documents, create multiple signature types (drawn, typed, or image-based), reposition them freely on the PDF viewer, edit or delete them if needed, and finally lock the document to generate a signed version. The system ensures coordinate scaling between frontend screen positioning and backend PDF coordinate mapping so that the final output matches exactly what the user sees on screen.

This project demonstrates practical implementation of full-stack development, file handling, authentication, state synchronization, and PDF rendering techniques.

Technologies used include Java 17, Spring Boot, Spring Security, Hibernate, React.js, Axios, Bootstrap, and Apache PDFBox.

The workflow starts with user authentication, followed by PDF upload, signature creation, drag-and-drop placement, saving coordinates, backend PDF processing, and finally downloading the signed document.

It is designed as a real-world e-signature system similar to DocuSign but simplified for learning and customization purposes.

---
