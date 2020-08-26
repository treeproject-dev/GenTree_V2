package app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import app.database.AppConnect;


@Controller
public class FindPage {

	@RequestMapping(value = {"/finds"}, method = RequestMethod.GET)
	public String finds(Model model) {
		
		AppConnect.getAppProp();
		return "find"; //<- it is name of HTML file without .html
	}

}

