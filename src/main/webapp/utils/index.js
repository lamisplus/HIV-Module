export const calculate_age = (dob) => {
  if (dob !== null && dob != "") {
    //Check if the DOB is not null or empty
    const today = new Date();
    const dateParts = dob.split("-");
    const birthDate = new Date(dob);

    // get the day, month and year of today
    let todayMonth = today.getMonth();
    let todayYear = today.getFullYear();
    let todayDate = today.getDate();

    // get the day, month and year from date of birth
    let birthDateMonth = birthDate.getMonth();
    let birthDateYear = birthDate.getFullYear();
    let birthdateDate = birthDate.getDate();

    // substract birthdate year from today year  ie todayYear - birthdateYear which  will give  "AssumedAge" is the age  we assume the patient will clock this year

    let assumedAge = todayYear - birthDateYear;
    if (assumedAge > 0) {
      //Checking the month to confirm if the age has been cloocked

      let monthGap = todayMonth - birthDateMonth;

      // If 'monthGap'> 0, the age has been clocked, 'monthGap'< 0, the age has not been clocked, 'monthGap'= 0, we are in the month then check date to confirm clocked age

      if (monthGap > 0) {
        return assumedAge + " year(s)";
      } else if (monthGap < 0) {
        let confirmedAge = assumedAge - 1;
        return confirmedAge + " year(s)";
      } else if (monthGap === 0) {
        let dateGap = todayDate - birthdateDate;

        if (dateGap > 0) {
          return assumedAge + " year(s)";
        } else if (dateGap < 0) {
          let confirmedAge = assumedAge - 1;
          return confirmedAge + " year(s)";
        }
      }
    } else {
      let monthGap = todayMonth - birthDateMonth;
      let dateGap = todayDate - birthdateDate;

      let monthOld = monthGap > 0 ? monthGap : 0;
      let DayOld = dateGap > 0 ? dateGap : 0;

      let result = monthOld ? monthOld + "month(s)" : DayOld + "day(s)";
      return result;
    }
  }
};

export const calculate_age_to_number = (dob) => {
  if (!dob) return 0;

  const today = new Date();
  const birthDate = new Date(dob);

  if (isNaN(birthDate.getTime())) return 0;

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 0 ? age : 0;
};



export const calculateAge = (dob) => {
  if (!dob) return 0;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};