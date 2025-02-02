package com.shopethethao.service;

import org.springframework.stereotype.Service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.imageio.ImageIO;

@Service
public class ZXingQRCodeService {

    public static byte[] generateQRCodeImage(String barcodeText) throws Exception {
        String filePath = getImageFilePath(barcodeText);
        try {
            QRCodeWriter barcodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = barcodeWriter.encode(barcodeText, BarcodeFormat.QR_CODE, 180, 180);
            BufferedImage qrCodeImage = MatrixToImageWriter.toBufferedImage(bitMatrix);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(qrCodeImage, "png", baos);
            Files.write(Paths.get(filePath), baos.toByteArray());

            return baos.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public static void deleteQRCodeImage(String barcodeText) {
        try {
            Path filePath = Paths.get(getImageFilePath(barcodeText));
            if (Files.exists(filePath)) {
                Files.delete(filePath);
                System.out.println("Đã xóa qr code");
            } else {
                System.out.println("file qr code không tồn tại");
            }
        } catch (IOException e) {
            System.err.println("Lỗi xóa qr code: " + e.getMessage());
        }
    }

    private static String getImageFilePath(String barcodeText) {
        return Paths.get(System.getProperty("user.dir"), "src", "main", "resources", "static", "images",
                barcodeText + ".png").toString();
    }
}
