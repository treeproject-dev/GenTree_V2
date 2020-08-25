package app.domain;

import java.util.Date;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import app.tree.Tree;
import app.tree.TreeInterface;



public class Wedding {

	/* FIELDS */

	// main:
	public Person husband;
	public Person wife;

	// additional:
	// ...

	/* Constructor */

	public Wedding(Person husband, Person wife) {
		super();
		this.husband = husband;
		this.wife = wife;
	}

	/* Getters & Setter */

	public Person getHusband() {
		return husband;
	}

	public void setHusband(Person husband) {
		this.husband = husband;
	}

	public Person getWife() {
		return wife;
	}

	public void setWife(Person wife) {
		this.wife = wife;
	}

	/****************************************/

	// ARS:
	// These variables represent id-es from dataBase
	// and are used in class Tree when interlinks are set.
	//
	// I believe that it's better to put them inside class than
	// send them separately with several additional arrays/lists.
	//
	public int mid; // <- marriage ID;
	public int pidH; // <- husband's ID;
	public int pidW; // <- wife's ID;
	// end//

	/****************************************/

	/* ---==[Navigation]==--- */

	// Start Stream of Searching;
	public TreeInterface search() {
		ArrayList<Person> ps = new ArrayList<Person>();
		ArrayList<Wedding> ws = new ArrayList<Wedding>();

		ws.add(this);

		Tree t = new Tree(ps, ws);
		return t;
	}

	// getters for navigation:
	// TODO Check;
	public List<Person> getSpouses() {
		List<Person> result = new ArrayList<Person>();
		result.add(this.getHusband());
		result.add(this.getWife());
		return result;
	};

	// TODO Check;
	public List<Person> getChildren(Tree t) {
		List<Person> result = t.persons.stream().filter((Person p) -> (p.getFamily() == this))
				.collect(Collectors.toList());
		return result;
	};

	// Wedding -> (mid,pidH,pidW)
	public String toJson() {
		return "{ " + "\"mid\":\"" + Integer.toString(this.mid) + "\" , " + "\"pidH\"\"" + Integer.toString(this.pidH)
				+ "\" , " + "\"pidW\"\"" + Integer.toString(this.pidW) + "\"" + " }";
	};

	// OLD:

	private Date weddingDate;

	public Wedding() {
	}

	public Date getWeddingDate() {

		return weddingDate;
	}

	@Override
	public String toString() {
		return "(" + husband + " <=> " + wife + ")";
	}

}