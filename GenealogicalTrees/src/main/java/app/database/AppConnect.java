package app.database;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
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

import app.domain.Person;
import app.domain.Wedding;

@Component
public class AppConnect {
	
	/*
	@Value("${spring.datasource.url}")
	private static String url;
	@Value("${spring.datasource.username}")
	private static String name;
	@Value("${spring.datasource.password}")
	private static String pass;
	

*/
	public static String url,name,pass;
	public AppConnect() {
		super();
		getAppProp();
	}

	

	
	
	
	public static void getAppProp() {
		try {
		BufferedReader reader = new BufferedReader(new FileReader("src\\main\\resources\\pass.txt")); 
		List<String>passFromFile = new ArrayList<>();
		while (reader.ready()) {									    
			String str = reader.readLine();
			passFromFile.add(str);
			};
			url = passFromFile.get(0);
			name = passFromFile.get(1);
			pass = passFromFile.get(2);
			reader.close();
		} catch (IOException e) {
			e.printStackTrace();
		}	
		
	}
	
	
	@PostConstruct
	public static Connection init() {
		Connection conn = null;		
		try {
			
			//String url = "jdbc:mysql://www.999.id.lv/?autoReconnect=true&serverTimezone=UTC&characterEncoding=utf8";
			Class.forName("com.mysql.cj.jdbc.Driver"); // Load the driver class
			conn = DriverManager.getConnection(url, name, pass); // Create connection
			conn.setAutoCommit(false);
			
		} catch (Exception e) {
			System.err.println(e);
		}
		return conn;
	}
	
	public static List<Wedding> findByFamiliesId(int id) {
		List<Wedding> weddings = new ArrayList<>();
		Wedding wedding = new Wedding();
		
		if (id != 0)
			try {
				Connection conn = init();
				//String url1 = "jdbc:mysql://www.999.id.lv/?autoReconnect=true&serverTimezone=UTC&characterEncoding=utf8";
				//Class.forName("com.mysql.cj.jdbc.Driver"); // Load the driver class
				//conn = DriverManager.getConnection(url, name, pass); // Create connection
				//conn.setAutoCommit(false);
				//System.out.println("CONNECT IS: " + connect);
				//System.out.println("CONN is " + connect.conn);
				// if (connect.conn == null) connect.init();
				String sql = "SELECT * FROM gentrees.family where family_id=?";
				PreparedStatement preparedStatement = conn.prepareStatement(sql);
				preparedStatement.setInt(1, id);
				ResultSet rs = preparedStatement.executeQuery();
				rs.next();

				wedding.mid = rs.getInt(1);
				wedding.pidH = rs.getInt(2);
				wedding.pidW = rs.getInt(3);

			
				weddings.add(wedding);
				
			} catch (Exception e) {
				// Auto-generated catch block
				e.printStackTrace();
			}

		return weddings;

	}

	public static List<Person> findAllByNames(String firstName, String lastName) {

	    List<Person> persons = new ArrayList<Person>();
	    
	    try {
	    Connection conn = init();
	      String sql = "SELECT * FROM gentrees.persons where person_name LIKE ? AND person_surname LIKE ?";
	      //PreparedStatement preparedStatement = conn.Init().prepareStatement(sql);
	      PreparedStatement preparedStatement = conn.prepareStatement(sql);
	      preparedStatement.setString(1, "%" + firstName + "%");
	      preparedStatement.setString(2, "%" + lastName + "%");
	      
	      ResultSet rs = preparedStatement.executeQuery();
	      
	      while (rs.next()) {
	        persons.add(new Person(rs.getInt(1), rs.getString(2), rs.getString(3)));
	      }
	      

	    } catch (SQLException e) {
	      //  Auto-generated catch block
	      e.printStackTrace();
	    }
	    
	    return persons;

	  }
	
	public static List<Person> findById(int id) {
		List<Person> persons = new ArrayList<>();
		try {
			Connection conn = init();
			String sql = "SELECT * FROM gentrees.persons where person_id=?";
			PreparedStatement preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setInt(1, id);
			ResultSet rs = preparedStatement.executeQuery();
			rs.next();

			Person person = new Person();
			person.setFirstName(rs.getString(2));
			person.setSurName(rs.getString(3));
			person.setDateBirth(rs.getDate(4));
			person.setDeath(rs.getDate(5));
			person.setGender(rs.getString(6));
			person.mid =rs.getInt(7);
			
			persons.add(person);
		} catch (SQLException e) {
			// Auto-generated catch block
			e.printStackTrace();
		}
		return persons;
	}
	
	public static boolean insertPerson(Person person) {

		int i = 0;
		try {
			Connection conn = init();
			java.sql.Date tmp, tmp2;
			if (person.getDeath() == null) {
				tmp = null;
			} else {
				tmp = new java.sql.Date(person.getDeath().getTime());
			}
			if (person.getDateBirth() == null) {
				tmp2 = null;
			} else {
				tmp2 = new java.sql.Date(person.getDateBirth().getTime());
			}
			String sql = "INSERT INTO gentrees.persons (person_name, person_surname, person_dateBirth, person_death, person_gender) VALUES (?,?,?,?,?)";
			PreparedStatement preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setString(1, person.getFirstName());
			preparedStatement.setString(2, person.getSurName());
			preparedStatement.setDate(3, tmp2);
			preparedStatement.setDate(4, tmp);
			preparedStatement.setString(5, person.getGender().toString());
			i = preparedStatement.executeUpdate();
			conn.commit();
		} catch (SQLException e) {
			// Auto-generated catch block
			e.printStackTrace();
		}

		return true;
	}
	
	public static List<Person> getByGenders(String gender) {
		List<Person> listByGender = new ArrayList<>();

		try {
			Connection conn = init();
			String sql = "SELECT * FROM gentrees.persons where person_gender=?";
			PreparedStatement preparedStatement = conn.prepareStatement(sql);
			preparedStatement.setString(1, gender);
			ResultSet rs = preparedStatement.executeQuery();

			while (rs.next())
				listByGender.add(new Person(rs.getString(2), rs.getString(3)));

			
		} catch (SQLException e) {
			// Auto-generated catch block
			e.printStackTrace();
		}
		
		return listByGender;
	}
	
}