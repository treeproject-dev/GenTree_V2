package utils;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Calendar;

public class DateConverters {

	public boolean isCorrectDate(String strDate) {
		boolean answer = false;
		try {
			Date date = new SimpleDateFormat("yyyy-MM-dd").parse(strDate);
			answer = true;
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return answer;
	}

	public String dateToString(Date date) {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
		String strDate = formatter.format(date);
		return strDate;
	}

	public Date stringToDate(String strDate) {
		Date date;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd").parse(strDate);
		} catch (ParseException e) {
			e.printStackTrace();
			date = new Date(0);
		}
		return date;

	}
}
