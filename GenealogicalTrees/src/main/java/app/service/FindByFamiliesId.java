package app.service;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Component;

import app.database.AppConnect;
import app.domain.Person;
import app.domain.Wedding;
@Component
public class FindByFamiliesId {
	
	
	public static List<Wedding> findByFamiliesId(int id){
		List<Wedding>weddings = new ArrayList<>();
		Wedding wedding = new Wedding();
		try {
			  AppConnect conn = new AppConnect();
		      String sql = "SELECT * FROM gentrees.family where family_id=?";
		      PreparedStatement preparedStatement = conn.conn.prepareStatement(sql);
		      preparedStatement.setInt(1, id);
		      ResultSet rs = preparedStatement.executeQuery();
		      rs.next();

		      wedding.mid = rs.getInt(1);
		      wedding.pidH = rs.getInt(2);
		      wedding.pidW = rs.getInt(3);
		      conn.conn.close();
		      weddings.add(wedding);
		      
		    } catch (SQLException e) {
		      // Auto-generated catch block
		      e.printStackTrace();
		    }
		
		
		return weddings;
		
	}

}
