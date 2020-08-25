package app.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class IndexPage {
private String greeting ="Please select: ";

@RequestMapping(value= {"/","/index"}  , method = RequestMethod.GET)public String index(Model model)
{
	model.addAttribute("greetings",greeting);
	
	return "index";
	}
}
