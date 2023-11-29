// Sure, here are some test cases for the `checkEmail` and `isOnlyDigits` functions:

// **checkEmail**

// * **Valid email addresses:**
//     * `john.doe@usiu.ac.ke`
//     * `jane.doe12@usiu.ac.ke`
//     * `_john-doe@usiu.ac.ke`
// * **Invalid email addresses:**
//     * `johndoe@usiu.ac.ke` (missing dot before `ac.ke`)
//     * `janedoe@gmail.com` (not a USIU email address)
//     * `johndoe+@usiu.ac.ke` (invalid character `+`)

// **isOnlyDigits**

// * **Strings with only digits:**
//     * `123456`
//     * `098765`
//     * `9876543210`
// * **Strings with non-digit characters:**
//     * `123abc`
//     * `456!@#`
//     * `789xyz`

// const {checkEmail, isOnlyDigits} = require("../public/js/signup.js")


import { checkEmail,isOnlyDigits } from "../Test_Cases";
describe("checkEmail function", () => {
  it("should return true for valid USIU email addresses", () => {
    expect(checkEmail("john.doe@usiu.ac.ke")).toBe(true);
    expect(checkEmail("jane.doe12@usiu.ac.ke")).toBe(true);
    expect(checkEmail("_john-doe@usiu.ac.ke")).toBe(true);
  });

  it("should return false for invalid email addresses", () => {
    expect(checkEmail("janedoe@gmail.com")).toBe(false);
    expect(checkEmail("johndoe+@usiu.ac.ke")).toBe(false);
  });
    
    it("Should only take digits", () => {
        expect(isOnlyDigits("133213")).toBe(true);
        expect(isOnlyDigits("133dsad213")).toBe(false);
    })
});

