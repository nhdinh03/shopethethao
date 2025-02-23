package com.shopethethao.auth.security.jwt.handler;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthEntryPointJwt implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException {
        // Just log the error and return without modifying response
        logger.error("Unauthorized error: {}", authException.getMessage());

        // Let Spring handle the response
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, authException.getMessage());
    }
}

// package com.shopethethao.auth.security.jwt.handler;

// import java.io.IOException;
// import java.util.HashMap;
// import java.util.Map;

// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.security.core.AuthenticationException;
// import org.springframework.security.web.AuthenticationEntryPoint;
// import org.springframework.stereotype.Component;

// import com.fasterxml.jackson.databind.ObjectMapper;

// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;

// @Component
// public class AuthEntryPointJwt implements AuthenticationEntryPoint {

//     private static final Logger logger = LoggerFactory.getLogger(AuthEntryPointJwt.class);

//     @Override
//     public void commence(HttpServletRequest request, HttpServletResponse response,
//             AuthenticationException authException) throws IOException {

//         logger.error("Unauthorized error: {}", authException.getMessage());

//         response.setContentType("application/json");
//         response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

//         Map<String, String> error = new HashMap<>();
//         error.put("status", "UNAUTHORIZED");
//         error.put("message", "Vui lòng đăng nhập để tiếp tục");
//         error.put("path", request.getServletPath());

//         ObjectMapper mapper = new ObjectMapper();
//         mapper.writeValue(response.getOutputStream(), error);
//     }
// }
