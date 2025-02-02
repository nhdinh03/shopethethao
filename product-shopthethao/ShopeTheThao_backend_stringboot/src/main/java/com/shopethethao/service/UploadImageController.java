package com.shopethethao.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Paths;

import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/upload")
public class UploadImageController {

  // Xem ảnh
  @GetMapping("/{id}")
  public ResponseEntity<Resource> readImage(@PathVariable String id) throws IOException {
    String path = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/images/" + id)
        .toString();

    File imageFile = new File(path);
    if (!imageFile.exists()) {
      return ResponseEntity.notFound().build();
    }

    try {
      Resource resource = new UrlResource(imageFile.toURI());
      if (resource.exists() && resource.isReadable()) {
        return ResponseEntity.ok()
            .contentType(MediaType.IMAGE_JPEG)
            .body(resource);
      } else {
        return ResponseEntity.notFound().build();
      }
    } catch (MalformedURLException e) {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping()
  public ResponseEntity<?> uploadImageA(@RequestParam("file_to_upload") MultipartFile file) throws IOException {

    Map<String, String> response = new HashMap<>();

    if (file.isEmpty()) {
      response.put("error", "Please select a file to upload.");
      return ResponseEntity.badRequest().body(response);
    }
    
    if (file.getSize() > 10 * 1024 * 1024) { 
      response.put("error", "Kích thước tệp vượt quá giới hạn 10MB. Thử lại sau!");
      return ResponseEntity.badRequest().body(response);
  }

    try {
      String path = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/").toString();

      File dir = new File(path, "images");
      if (!dir.exists()) {
        dir.mkdirs();
      }
      String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

     
      File uploadedFile = new File(dir, uniqueFileName);
      file.transferTo(uploadedFile);

      response.put("PATH", path);
      response.put("destination", dir.toString());
      response.put("fieldName", uniqueFileName);
      response.put("filename", file.getOriginalFilename());
      response.put("mimetype", file.getContentType());
      response.put("originalName", file.getOriginalFilename());
      response.put("path", "http://localhost:8081/api/upload/" + uniqueFileName);
      response.put("size", Long.toString(file.getSize()));

      return ResponseEntity.status(HttpStatus.OK).body(response);

    } catch (Exception e) {
      return ResponseEntity.badRequest().body("Lỗi hình ảnh");

    }
  }

  @PutMapping("/{imageName}")
  public ResponseEntity<?> updateImage(@PathVariable String imageName, @RequestParam("file_to_upload") MultipartFile file) throws IOException {
      Map<String, String> response = new HashMap<>();
  
      String path = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/images/" + imageName).toString();
  
      File imageFile = new File(path);
  
      if (!imageFile.exists()) {
          return uploadImageA(file);
      }
  
      if (file.isEmpty()) {
          response.put("error", "Vui lòng chọn một tập tin để tải lên");
          return ResponseEntity.badRequest().body(response);
      }
       if (file.getSize() > 10 * 1024 * 1024) { 
      response.put("error", "File size exceeds the limit of 10MB.");
      return ResponseEntity.badRequest().body(response);
  }
  
      try {
          String uniqueFileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
          File updatedFile = new File(imageFile.getParent(), uniqueFileName);
          file.transferTo(updatedFile);
  
          if (imageFile.delete()) {
              response.put("destination", updatedFile.getParent());
              response.put("fieldName", uniqueFileName);
              response.put("filename", file.getOriginalFilename());
              response.put("mimetype", file.getContentType());
              response.put("originalName", file.getOriginalFilename());
              response.put("path", "http://localhost:8081/api/upload/" + uniqueFileName);
              response.put("size", Long.toString(file.getSize()));
  
              return ResponseEntity.status(HttpStatus.OK).body(response);
          } else {
              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể xóa tệp hình ảnh cũ.");
          }
      } catch (Exception e) {
          return ResponseEntity.badRequest().body("Lỗi hình ảnh");
      }
  }
  
  

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteImage(@PathVariable String id) {
    String path = Paths.get(System.getProperty("user.dir"), "src/main/resources/static/images/" + id).toString();

    File imageFile = new File(path);
    if (!imageFile.exists()) {
      return ResponseEntity.ok().build();
    }
    if (imageFile.delete()) {
      return ResponseEntity.ok("Xóa thành công");
    } else {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Không thể xóa hình ảnh.");
    }
  }

}
