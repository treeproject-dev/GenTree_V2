package app.service;

import javax.validation.ConstraintViolationException;
import org.springframework.security.core.userdetails.UserDetailsService;

import app.users.User;
import app.web.dto.UserRegistrationDto;

public interface UserService extends UserDetailsService{
	User save(UserRegistrationDto registrationDto) throws Exception;

}
