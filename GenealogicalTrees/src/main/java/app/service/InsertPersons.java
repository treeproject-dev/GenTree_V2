package app.service;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.SQLException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import app.database.AppConnect;
import app.domain.Person;

@Component
public class InsertPersons {

	@Autowired
	protected AppConnect conn;

	public boolean insertPerson(Person person) {

		int i = 0;
		try {
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
			PreparedStatement preparedStatement = conn.conn.prepareStatement(sql);
			preparedStatement.setString(1, person.getFirstName());
			preparedStatement.setString(2, person.getSurName());
			preparedStatement.setDate(3, tmp2);
			preparedStatement.setDate(4, tmp);
			preparedStatement.setString(5, person.getGender().toString());
			i = preparedStatement.executeUpdate();
			conn.conn.commit();
		} catch (SQLException e) {
			// Auto-generated catch block
			e.printStackTrace();
		}

		return true;
	}

}
