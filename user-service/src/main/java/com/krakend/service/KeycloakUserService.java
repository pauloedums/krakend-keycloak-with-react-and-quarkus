package com.krakend.service;
import com.krakend.dto.UserDTO;
import com.krakend.dto.UserRegistrationRecord;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.resource.UserResource;

public interface KeycloakUserService {

    Response createUser(UserRegistrationRecord userRegistrationRecord);
    UserDTO getUserByEmail(String subject);
    Boolean emailIsVerified(String userId);
    void deleteUserById(String userId);
    void emailVerification(String userId);
    UserResource getUserResource(String userId);
    Response updatePassword(UserRegistrationRecord user);
    Response logout(String userId);
}
