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
public class GetListsForWeddings {

	@Autowired
	protected AppConnect conn;

	public List<Person> getByGenders(String gender) {
		List<Person> listByGender = new ArrayList<>();

		try {
			String sql = "SELECT * FROM gentrees.persons where person_gender=?";
			PreparedStatement preparedStatement = conn.conn.prepareStatement(sql);
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
