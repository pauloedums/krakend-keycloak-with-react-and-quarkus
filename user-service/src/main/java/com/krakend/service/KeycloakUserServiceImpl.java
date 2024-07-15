package com.krakend.service;

import com.krakend.dto.DefaultMessage;
import com.krakend.dto.UserDTO;
import com.krakend.dto.UserRegistrationRecord;
import com.krakend.exception.ErrorResponse;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;

@Service
public class KeycloakUserServiceImpl implements KeycloakUserService{

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.adminClientId}")
    private String client;

    public KeycloakUserServiceImpl(Keycloak keycloak) {
        this.keycloak = keycloak;
    }

    @Override
    public Response createUser(UserRegistrationRecord userRegistrationRecord) throws WebApplicationException {
        UserRepresentation user = createUserRepresentation(userRegistrationRecord);

        UsersResource usersResource = getUsersResource();
        Response response = null;
        try {
            response = usersResource.create(user);
            if(Objects.equals(201,response.getStatus())){

                List<UserRepresentation> representationList = usersResource.searchByUsername(userRegistrationRecord.username(), true);
                if(!CollectionUtils.isEmpty(representationList)){
                    UserRepresentation userRepresentation1 = representationList.stream()
                            .filter(userRepresentation -> Objects.equals(false, userRepresentation.isEmailVerified()))
                            .findFirst()
                            .orElse(null);
                    assert userRepresentation1 != null;
                    emailVerification(userRepresentation1.getId());
                }
                DefaultMessage message = new DefaultMessage("Your user was created!","Please, validate your e-mail before login.");
                return Response.ok(message).build();
            } else {
                if(Objects.equals(409, response.getStatus())) {
                    String errorId = UUID.randomUUID().toString();
                    String errorMessageEmail = ResourceBundle.getBundle("ValidationMessages").getString("User.email.required");
                    ErrorResponse.ErrorMessage errorMessage = new ErrorResponse.ErrorMessage(errorMessageEmail);
                    ErrorResponse errorResponse = new ErrorResponse(errorId, errorMessage);
                    return Response.serverError().entity(errorResponse).build();
                }
            }
        } catch (WebApplicationException e) {
            return new WebApplicationException(response).getResponse();
        }
        return response;
    }

    private static UserRepresentation createUserRepresentation(UserRegistrationRecord userRegistrationRecord) {
        UserRepresentation user= new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(userRegistrationRecord.username());
        user.setEmail(userRegistrationRecord.email());
        user.setFirstName(userRegistrationRecord.firstName());
        user.setLastName(userRegistrationRecord.lastName());
        user.setEmailVerified(false);

        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(userRegistrationRecord.password());
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);

        List<CredentialRepresentation> list = new ArrayList<>();
        list.add(credentialRepresentation);
        user.setCredentials(list);
        return user;
    }

    private UsersResource getUsersResource() {
        RealmResource realm1 = keycloak.realm(realm);
        return realm1.users();
    }

    @Override
    public void emailVerification(String userId){
        getUserResource(userId).sendVerifyEmail(client, "http://localhost:3000/verify-email");
    }

    public Boolean emailIsVerified(String userId) {
        return getUsersResource().get(userId).toRepresentation().isEmailVerified();
    }

    @Override
    public UserDTO getUserByEmail(String userId) {
        UserRepresentation userRepresentation = getRepresentation(userId);
        return UserDTO.builder()
                .name(userRepresentation.getFirstName())
                .email(userRepresentation.getEmail())
                .username(userRepresentation.getUsername())
                .build();
    }

    private UserRepresentation getRepresentation(String userId) {
        return getUserResource(userId).toRepresentation();
    }

    @Override
    public void deleteUserById(String userId) {
        getUsersResource().delete(userId);
    }

    public UserResource getUserResource(String userId){
        UsersResource usersResource = getUsersResource();
        return usersResource.get(userId);
    }

    @Override
    public Response updatePassword(UserRegistrationRecord user) {
        List<UserRepresentation> userRepresentations = getUsersResource().searchByEmail(user.email(), true);
        UserResource userResource = getUserResource(userRepresentations.getFirst().getId());
        CredentialRepresentation credentialRepresentation = new CredentialRepresentation();
        credentialRepresentation.setValue(user.password());
        userResource.resetPassword(credentialRepresentation);
        return Response.ok("Your password was reset successfully!").build();
    }


    @Override
    public Response logout(String userId){
        if(getUsersResource().get(userId).toRepresentation().isEnabled()) {
            getUsersResource().get(userId).logout();
            return Response.ok(new DefaultMessage("Logout","Logged out successfully")).build();
        }
        return Response.ok(new DefaultMessage("Logout","Logged out unsuccessfully")).build();
    }
}
