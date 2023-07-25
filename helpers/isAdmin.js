// function isAdmin(idOfChat, ctx) {
//     return new Promise((resolve, reject) => {
//         ctx.telegram.getChatMember(idOfChat).then((user) => {
//             // resolve(user.status == "administrator" || user.status == "creator");
//             console.log(idOfChat)
//         })
//             .catch((error) => {
//                 reject(error);
//             });
//     });
// }

// exports.isAdmin = isAdmin;