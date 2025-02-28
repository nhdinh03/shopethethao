package com.shopethethao.service;

import java.io.File;
import java.nio.file.Paths;

import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

@Service
public class UploadImageService {
    public static boolean deleteImage(@PathVariable String id) {
    String path = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/images" + id).toString();

    File imageFile = new File(path);
    if (!imageFile.exists()) {
      return false;
    }
    if (imageFile.delete()) {
      return true;
    } else {
      return false;
    }
  }
}
