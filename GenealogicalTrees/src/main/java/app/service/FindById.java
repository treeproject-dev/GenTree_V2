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
public class FindById {
	
	@Autowired
	protected AppConnect conn;
	
	protected static Person person;

	public List<Person> findById(int id) {
		List<Person> persons = new ArrayList<>();
		try {
			String sql = "SELECT * FROM gentrees.persons where person_id=?";
			PreparedStatement preparedStatement = conn.conn.prepareStatement(sql);
			preparedStatement.setInt(1, id);
			ResultSet rs = preparedStatement.executeQuery();
			rs.next();

			person = new Person(rs.getString(2), rs.getString(3), rs.getString(6), rs.getDate(4), rs.getInt(7));
			

			persons.add(person);
		} catch (SQLException e) {
			// Auto-generated catch block
			e.printStackTrace();
		}
		return persons;
	}
}
