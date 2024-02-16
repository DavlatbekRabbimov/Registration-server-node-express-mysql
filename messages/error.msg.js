const error = {
    emptyField: (field) => `Error: ${field} field is empty!`,
    invalidField: (field) => `Error: ${field} invalid!`,
    notFound: (field) => `Error: ${field} not found!`,
    allEmptyFields: 'Error: All fields is empty!',
    userRegister: 'Error: Registration is invalid!',
    existingUser: 'Error: User is already registered. Please use other e-mail for registration!',
    tableError: 'Error: Table not found!',
    statusError: 'Error: User status not updated!',
    deleteError: 'Error: User not deleted!',
    authError: 'Error: Authentication is failed!',
    blocked: 'Error: User blocked!'
};

module.exports = error;
