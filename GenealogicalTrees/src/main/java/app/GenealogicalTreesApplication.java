package app;

import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

import app.domain.Person;
import app.domain.Wedding;
import app.service.FindByFamiliesId;
import app.service.FindById;
import app.service.GetListsForWeddings;

@ComponentScan
@EnableAutoConfiguration
@SpringBootApplication
public class GenealogicalTreesApplication {
	 
	public static void main(String[] args) {
		SpringApplication.run(GenealogicalTreesApplication.class, args);
		}
	


}
