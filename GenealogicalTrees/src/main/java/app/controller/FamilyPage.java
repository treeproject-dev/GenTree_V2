package app.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.database.AppConnect;
import app.domain.Wedding;

@RestController
public class FamilyPage {
	
	//@Autowired
	//protected FindByFamiliesId ff;
	
	@RequestMapping("/families")
	public String fams(HttpServletRequest request, HttpServletResponse response) 
	{
		List<Wedding>wedList = AppConnect.findByFamiliesId(2);
		StringBuilder sb = new StringBuilder();
		String header = "<html><head><title>FindByID page</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"/css/design.css\"></head><body>";
		sb.append(header);
		
		sb.append(wedList.toString());
		
		sb.append("<br/><a href='/'>Back</a></p>");
		sb.append("</body></html>");
		
		return sb.toString();
		
	}

}
