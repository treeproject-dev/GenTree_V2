package utils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateValidators {

	public boolean isBirthDateLessThanDeath(Date birthDate, Date death) {
		boolean status = false;
		if (birthDate.before(death))
			return true;
		return status;
	}

	public boolean isBirthDateGreaterThanToday(Date birthDate) {
		Date today = Calendar.getInstance().getTime();
		boolean status = false;
		if (birthDate.after(today))
			return true;

		return status;
	}

	public boolean ifNameHasNumbers(String name) {
		boolean status = true;
		if (name.matches(".*\\d+.*"))
			return false;

		return status;
	}

	public boolean hasNameFirstCharSpace(String name) {
		boolean status = false;
		if (name.startsWith(" "))
			return true;

		return status;
	}

	public boolean hasNameLastCharSpace(String name) {
		boolean status = false;
		if (name.endsWith(" "))
			return true;

		return status;
	}

}
