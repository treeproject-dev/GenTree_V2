package app.tree;

import java.util.List;

public interface Kleisli<Ti,To> {
	
	/***
	 * This Interface is implemented for using lambda-functions.
	 * They should be Kleisli-arrows and have signature:
	 * 
	 * 		k :: x -> [y]
	 * 
	 * It's essential for correct working.
	 * 
	 * as Ti (input type) and To (output type) we understand 
	 * classes Person and Wedding.
	 * 
	 * @param in
	 * @return [out]
	 */

	//kleisli k :: Ti -> To
	public List<To> run(Ti in);
	
}
