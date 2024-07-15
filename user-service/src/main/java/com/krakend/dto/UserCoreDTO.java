package com.krakend.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Getter
@Setter
public class UserCoreDTO {
    private String username;
    private String email;
    private String role;
}
