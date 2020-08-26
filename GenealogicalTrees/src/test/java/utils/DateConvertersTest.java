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
		
		assertEquals(false, dc.isCorrectDate(wrongDate));	
		assertEquals(true, dc.isCorrectDate(okDate));
		
	}


}
