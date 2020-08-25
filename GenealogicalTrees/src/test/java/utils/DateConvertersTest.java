package utils;

import static org.junit.jupiter.api.Assertions.*;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.junit.jupiter.api.Test;

class DateConvertersTest {
	DateConverters dc = new DateConverters();

	@Test
	void testIsCorrectDate() {
		String wrongDate = "2019-AA-#";
		String okDate = "2020-05-01";
		boolean result = dc.isCorrectDate(wrongDate);
		assertEquals(false, result);
		result = dc.isCorrectDate(okDate);
		assertEquals(true, result);
		
	}

	@Test
	void testDateToString() {
		Date date = new Date();
		date.setYear("2020-10-05");
		SimpleDateFormat smp = new SimpleDateFormat("yyyy-MM-dd");
		smp.format(date);
		String dt = dc.dateToString(date);
		System.out.println(dt);
		//assertEquals(,date);
	}

	@Test
	void testStringToDate() {
		fail("Not yet implemented");
	}

}
