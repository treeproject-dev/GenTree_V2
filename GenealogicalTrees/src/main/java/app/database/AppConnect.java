package app.database;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Properties;
import java.util.logging.Logger;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Component
public class AppConnect {
	public Connection conn;
	@Value("${spring.datasource.url}")
	private String url;
	@Value("${spring.datasource.username}")
	private String name;
	@Value("${spring.datasource.password}")
	private String pass;
	
	
	@PostConstruct
	public void init() {
		
		try {
			
			//String url = "jdbc:mysql://www.999.id.lv/?autoReconnect=true&serverTimezone=UTC&characterEncoding=utf8";
			Class.forName("com.mysql.cj.jdbc.Driver"); // Load the driver class
			conn = DriverManager.getConnection(url, name, pass); // Create connection
			conn.setAutoCommit(false);
			
		} catch (Exception e) {
			System.err.println(e);
		}
		
	}

}