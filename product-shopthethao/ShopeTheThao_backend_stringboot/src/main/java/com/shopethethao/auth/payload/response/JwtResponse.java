package com.shopethethao.auth.payload.response;

import java.util.List;

import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private String tokenId;
    private String type = "Bearer";
    private String username;
    private List<String> roles;

    public JwtResponse(String token, String tokenId, String username, List<String> roles) {
        this.token = token;
        this.tokenId = tokenId;
        this.username = username;
        this.roles = roles;
    }

    public String getTokenId() {
        return tokenId;
    }

    public void setTokenId(String tokenId) {
        this.tokenId = tokenId;
    }
}
