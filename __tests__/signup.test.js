//passes


import { checkEmail,isOnlyDigits } from "../Test_Cases";
describe("checkEmail function", () => {
  it("should return true for valid USIU email addresses", () => {
    expect(checkEmail("john.doe@usiu.ac.ke")).toBe(true);
    expect(checkEmail("jane.doe12@usiu.ac.ke")).toBe(true);
    expect(checkEmail("_john-doe@usiu.ac.ke")).toBe(true);
    expect(checkEmail("martha@usiu.ac.ke")).toBe(true);
    expect(checkEmail("hello@usiu.ac.ke")).toBe(true);
    expect(checkEmail("lorraine@usiu.ac.ke")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(checkEmail("janedoe@gmail.com")).toBe(false);
      expect(checkEmail("johndoe+@usiu.ac.ke")).toBe(false);
      expect(checkEmail("martha@usiu.ke")).toBe(false)
  });
    
    it("Should only take digits", () => {
        expect(isOnlyDigits("133213")).toBe(true);
    })
    it("should not take id numbers which are not only digits", () => {
        expect(isOnlyDigits("237sgd")).toBe(false);
        expect(isOnlyDigits("hhskaa")).toBe(false);
        expect(isOnlyDigits("133dsad213")).toBe(false);
    })

    it("should not take id numbers which are not 6 digits long", () => {
      expect(isOnlyDigits("1234567")).toBe(false);
      expect(isOnlyDigits("1234")).toBe(false);
      expect(isOnlyDigits("133dsad213")).toBe(false);
      expect(isOnlyDigits("213")).toBe(false);
    });
});

