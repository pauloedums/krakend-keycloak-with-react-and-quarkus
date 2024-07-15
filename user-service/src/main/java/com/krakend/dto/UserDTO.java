package com.krakend.dto;

import lombok.Builder;

@Builder
public record UserDTO(String username,String name, String email) {
}
