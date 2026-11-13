export const generateRandomName = () => {
    const randomNumber = Math.floor(100 + Math.random() * 900);
 
    return {
        firstName: `Test${randomNumber}`,
        lastName: `Demo${randomNumber}`,
        fullName: `Test${randomNumber} Demo${randomNumber}`
    };
};