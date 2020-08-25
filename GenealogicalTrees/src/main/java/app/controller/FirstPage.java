package app.controller;

import java.sql.Connection;
import java.util.Date;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import app.database.AppConnect;
import app.domain.Person;
import app.service.FindAllByNames;
import app.service.InsertPersons;
import utils.DateConverters;

@RestController
public class FirstPage {
	
	@Autowired
	protected AppConnect conn;
	
	public static DateConverters conv = new DateConverters();
	//public static AppConnect conn = new AppConnect();

/*	@RequestMapping("/no")
	public String select() {
		StringBuilder sb = new StringBuilder();
		String header = "<html><head><title>FindByID page</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"/css/design.css\"></head><body>";	
		sb.append(header);
		sb.append("<p><a href='/find'>Find By Name</a><br/>");
		sb.append("<a href='/save'>Save new person</a></p>");
		sb.append("<a href='/weddings'>Weddings Page</a></p>");
	

		return sb.toString();
	}
*/
	@Autowired
	protected InsertPersons save;
	
	@RequestMapping("/save")
	@ResponseBody
	public String test(HttpServletRequest request, HttpServletResponse response) {

		StringBuilder sb = new StringBuilder();
		String header = "<html><head><title>FindByID page</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"/css/style.css\"></head><body>";	
		sb.append(header);
		sb.append("<p><form action=''>                                              ");
		sb.append("  <label for='fname'>First name:</label><br/>                    ");
		sb.append("  <input type='text' name='name' value=''><br/>                  ");
		sb.append("  <label for='lname'>Last name:</label><br/>                     ");
		sb.append("  <input type='text' name='surname'  value=''><br/>              ");
		sb.append("  <label for='lname'>Date of Birth:</label><br/>                 ");
		sb.append("	<input type='date' name='date'><br/><br/>                       ");
		sb.append("  <label for='lname'>Date of Death:</label><br/>                 ");
		sb.append("	<input type='date' name='datedead'><br/><br/>                   ");
		sb.append("<input type='radio' name='gender' value='male'>       			");
		sb.append("  <label for='male'>Male</label><br>                             ");
		sb.append("  <input type='radio'  name='gender' value='female'> 		    ");
		sb.append("  <label for='female'>Female</label><br>                         ");
		sb.append("  <input type='radio'  name='gender' value='unknown'>			");
		sb.append("  <label for='unknown'>Unknown</label>                           ");
		sb.append("<br/><br/>                                                       ");
		sb.append("  <input type='submit' value='Submit'>                           ");
		sb.append("</form>                                                          ");

		if (request.getParameter("gender") != (null)) {
			Person person = new Person();
			if (request.getParameter("date")!=""&&!request.getParameter("date").equals(null)){if(conv.isCorrectDate(request.getParameter("date"))) {person.setDateBirth(conv.stringToDate(request.getParameter("date")));}}
			if (request.getParameter("datedead")!=""&&!request.getParameter("datedead").equals(null)){if(conv.isCorrectDate(request.getParameter("datedead"))) {person.setDeath(conv.stringToDate(request.getParameter("datedead")));}}	
			
			person.setFirstName(request.getParameter("name"));	
			person.setSurName(request.getParameter("surname"));
			person.setGender(request.getParameter("gender"));
		if (person.getFirstName()!=""||person.getSurName()!="") {
		
				try {
					boolean status = save.insertPerson(person);
					if (status) sb.append("<p style='color:green'>Person added in DB</p>");
					else sb.append("<p style='color:red'>Error, person not added</p>");
				} catch (Exception e) {
					sb.append("<p style='color:red'>Try again with correct information</p>");
					System.err.println(e);
				}

			} else {
				sb.append("<p style='color:red'>Try again with correct information</p>");
				}
			
		}
		sb.append("<a href='/'>Back</a></p> ");
		return sb.toString();
	}

	@Autowired
	protected FindAllByNames findAll;
	
	@RequestMapping("/find")
	@ResponseBody
	public String find(@RequestParam(value = "name", required = false) String name,
			@RequestParam(value = "surname", required = false) String surname, HttpServletRequest request,
			HttpServletResponse response) {
		//FindAllByNames find = new FindAllByNames();
		StringBuilder sb = new StringBuilder();
		String header = "<html><head><title>FindByID page</title><meta charset=\"utf-8\"><link rel=\"stylesheet\" href=\"/css/style.css\"></head><body>";	
		sb.append(header);
		sb.append("<p><form action=''>");
		sb.append("<label for='fname'>First name:</label><br/>");
		sb.append("<input type='text' name='name' value=''><br/>");
		sb.append("<label for='lname'>Last name:</label><br/>");
		sb.append("<input type='text' name='surname'  value=''><br/>");
		sb.append("<input type='submit' value='Submit'>");
		sb.append("</form><br/>");

		if (name != null && !"".equals(name) && surname != null && !"".equals(surname)) {
			List<Person> persons = findAll.findAllByNames(name, surname);
			sb.append("<table>");
			// sb.append("<style>table, th, td {border: 1px solid black;}</style>");
			sb.append("<tr><td>Id</td><td>Name</td><td>Surname</td></tr>");
			for (Person it : persons) {
				String callF = "<a href=/findbyid?id=" + it.getPid() + ">" + it.getPid() + "</a>";
				sb.append("<tr><td>" + callF + "</td><td>" + it.getFirstName() + "</td><td>" + it.getSurName()
						+ "</td></tr>");
			}
			sb.append("</table><br/>");
		}

		sb.append("<a href='/'>Back</a></p>");
		return sb.toString();
	}

}
