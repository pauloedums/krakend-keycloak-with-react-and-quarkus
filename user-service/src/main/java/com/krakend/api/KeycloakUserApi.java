package com.krakend.api;

import com.krakend.dto.UserDTO;
import com.krakend.dto.UserRegistrationRecord;
import com.krakend.exception.ErrorResponse;
import com.krakend.service.KeycloakUserService;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;


@RestController
@RequestMapping("/users")
public class KeycloakUserApi {

    @Inject
    JsonWebToken jsonWebToken;

//    private static final Logger LOG = Logger.getLogger(KeycloakUserApi.class);

    private final KeycloakUserService keycloakUserService;

    public KeycloakUserApi(KeycloakUserService keycloakUserService) {
        this.keycloakUserService = keycloakUserService;
    }

    @PostMapping
    public Response createUser(@RequestBody UserRegistrationRecord userRegistrationRecord) throws WebApplicationException{
        return keycloakUserService.createUser(userRegistrationRecord);
    }

    @GetMapping("/get-user")
    @Authenticated
    public Response getUser() throws WebApplicationException {
        String subject = jsonWebToken.getSubject();
        boolean emailIsVerified = keycloakUserService.emailIsVerified(subject);
        if(emailIsVerified){
            UserDTO userDTO = keycloakUserService.getUserByEmail(subject);
            return Response.ok(userDTO).build();
        }
        else{
            String name = jsonWebToken.getName();
            String friendlyMessage = "@" + name + ", your email needs to be verified.";
            ErrorResponse.ErrorMessage errorMessage = new ErrorResponse.ErrorMessage(friendlyMessage, "resend-verification-email");
            ErrorResponse errorResponse = new ErrorResponse(UUID.randomUUID().toString(), errorMessage);
            return Response.serverError().entity(errorResponse).build();
        }
    }

    @DeleteMapping("/{userId}")
    @Authenticated
    public void deleteUserById(@PathVariable String userId) {
        keycloakUserService.deleteUserById(userId);
    }

    @PutMapping("/update-password")
    public Response updatePassword(@RequestBody UserRegistrationRecord user) {
        return keycloakUserService.updatePassword(user);
    }

    @GetMapping("/logout")
    @Authenticated
    public Response logout() {
        String subject = jsonWebToken.getSubject();
        return keycloakUserService.logout(subject);
    }

}