export function formatDate(dateString = null , formatter = '-') {
  if (dateString) {
    return (
      dateString?.getDate() +
      formatter +
      (dateString?.getMonth() + 1) +
      formatter +
      dateString?.getFullYear()
    );
  }
}

export function capitalizeWords(inputString) {
    if (typeof inputString == "string") {
      const words = inputString?.split(" ");
      const capitalizedWords = words?.map((word) => {
        if (word.length > 0) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        } else {
          return word;
        }
      });
      const resultString = capitalizedWords?.join(" ");
      return resultString;
    } else {
      return inputString;
    }
  }
  

  export const formatText = (str) => {
    if (!str) return;
    if (typeof str !== "string") {
      return str;
    }
    let splittedString = str.split("_");
    if ((splittedString.length > 1) & (splittedString.length < 3)) {
      return (
        splittedString[0].charAt(0).toUpperCase() +
        splittedString[0].slice(1) +
        " " +
        splittedString[1].charAt(0).toUpperCase() +
        splittedString[1].slice(1)
      );
    } else if (splittedString.length >= 3) {
      return (
        splittedString[0].charAt(0).toUpperCase() +
        splittedString[0].slice(1) +
        " " +
        splittedString[1].charAt(0).toUpperCase() +
        splittedString[1].slice(1) +
        " " +
        splittedString[2].charAt(0).toUpperCase() +
        splittedString[2].slice(1)
      );
    } else {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };
  
export function generatePassword(length = 10) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export function formatFilterDate(date) {
  const formattedDate = new Date(date);
  const year = formattedDate.getFullYear();
  const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
  const day = String(formattedDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}