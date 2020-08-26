package app.controller;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import app.database.AppConnect;
import app.domain.Person;


@RestController
public class WeddingsPage {

	//@Autowired
	//protected AppConnect conn;

	//@Autowired
	//protected GetListsForWeddings weddingListService;

	@RequestMapping("/weddings")
	public String findById(HttpServletRequest request, HttpServletResponse response) {
		List<Person> males = AppConnect.getByGenders("male");
		List<Person> females = AppConnect.getByGenders("female");
		StringBuilder sb = new StringBuilder();
		String header = "<html><head><title>FindByID page</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"/css/design.css\"></head><body>";
		sb.append(header);
		String result = "";

		sb.append("<table>");

		for (Person it : males) {
			String toPrint = it.getFirstName() + " " + it.getSurName();
			sb.append("<tr><td>" + " " + "</td><td>" + toPrint + "</td><td>");
		}
		sb.append("<br/><br/><br/>");
		for (Person it : females) {
			String toPrint = it.getFirstName() + " " + it.getSurName();
			sb.append("<tr><td>" + " " + "</td><td>" + toPrint + "</td><td>");
		}
		sb.append("</table><br/>");

		sb.append("<a href='/'>Back</a></p>");
		sb.append("</body></html>");
		return sb.toString();

	}
}
