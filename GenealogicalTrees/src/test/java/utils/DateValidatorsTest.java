package utils;

import static org.junit.jupiter.api.Assertions.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import org.junit.jupiter.api.Test;

class DateValidatorsTest {
	DateValidators valid = new DateValidators();
	SimpleDateFormat sm = new SimpleDateFormat("yyyy.MM.dd");

	@Test
	void testIsBirthDateLessThanDeath() {
		Date birthDate = new Date(2011, 11, 1);
		Date death = new Date(2000, 11, 1);
		boolean result = valid.isBirthDateLessThanDeath(birthDate, death);
		assertEquals(false, result);
		death = new Date(2019, 11, 1);
		result = valid.isBirthDateLessThanDeath(birthDate, death);
		assertEquals(true, result);
	}

	@Test
	void testIsBirthDateGreaterThanToday() throws ParseException {
		Date birthDate = sm.parse("2017.01.01");
		boolean result = valid.isBirthDateGreaterThanToday(birthDate);
		assertEquals(false, result);
		birthDate = sm.parse("2037.01.01");
		result = valid.isBirthDateGreaterThanToday(birthDate);
		assertEquals(true, result);
	}

	@Test
	void testIfNameHasNumbers() {
		String badName = "badN2me";
		String goodName = "goodName";
		boolean result = valid.ifNameHasNumbers(badName);
		assertEquals(false, result);
		result = valid.ifNameHasNumbers(goodName);
		assertEquals(true, result);

	}

	@Test
	void testHasNameFirstCharSpace() {
		String badName = " badName";
		String goodName = "goodName";
		boolean result = valid.hasNameFirstCharSpace(badName);
		assertEquals(true, result);
		result = valid.hasNameFirstCharSpace(goodName);
		assertEquals(false, result);
	}

	@Test
	void testHasNameLastCharSpace() {
		String badName = "badName ";
		String goodName = "goodName";
		boolean result = valid.hasNameLastCharSpace(badName);
		assertEquals(true, result);
		result = valid.hasNameLastCharSpace(goodName);
		assertEquals(false, result);
	}

}
