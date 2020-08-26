package utils;

import java.util.ArrayList;

public class ValidateInput {

	public boolean validateNewPerson(String name, String surname, String gender) {
		
		ArrayList<Boolean> check = new ArrayList<Boolean>();
		
		if(name != "") {
			if(name.matches(".*\\d.*")) {
				check.add(0, false);
			}
			check.add(0, true);
		}
		else{
			check.add(0, false);
		}
		
		if(surname != "") {
			if(surname.matches(".*\\d.*")) {
				check.add(1, false);
			}
			check.add(1, true);
		}
		else{
			check.add(1, false);
		}
		
		if(gender != "") {
			check.add(2, true);
		}
		else{
			check.add(2, false);
		}
		
		boolean validation = true;
		
		for (Boolean blnCheck : check) {
			if(blnCheck == false)
				validation = false;;
		}
		return validation;
	}
	
}
