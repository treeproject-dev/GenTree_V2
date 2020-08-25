package app.domain;

import java.util.Date;

public class Wedding {
	
	public int mid,pidH,pidW;

	public Wedding() {}
	
	

	public int getMid() {
		return mid;
	}



	public void setMid(int mid) {
		this.mid = mid;
	}



	public int getPidH() {
		return pidH;
	}



	public void setPidH(int pidH) {
		this.pidH = pidH;
	}



	public int getPidW() {
		return pidW;
	}



	public void setPidW(int pidW) {
		this.pidW = pidW;
	}



	@Override
	public String toString() {
		return "Wedding [mid=" + mid + ", pidH=" + pidH + ", pidW=" + pidW + "]";
	}



}