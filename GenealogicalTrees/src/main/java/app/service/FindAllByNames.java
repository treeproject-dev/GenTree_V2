package app.service;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import app.database.AppConnect;
import app.domain.Person;

@Component
public class FindAllByNames {
	
	@Autowired
	protected AppConnect conn;
 	
	public List<Person> findAllByNames(String firstName, String lastName) {

	    List<Person> persons = new ArrayList<Person>();
	    
	    try {
	      String sql = "SELECT * FROM gentrees.persons where person_name LIKE ? AND person_surname LIKE ?";
	      //PreparedStatement preparedStatement = conn.Init().prepareStatement(sql);
	      PreparedStatement preparedStatement = conn.conn.prepareStatement(sql);
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
	
}
