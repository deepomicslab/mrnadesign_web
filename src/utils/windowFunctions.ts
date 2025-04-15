export const windowErrorMessage = (msg: string) => {
    window.$message.error(msg, {
        closable: true,
        duration: 5000,
    })
}
export const windowSuccessMessage = (msg: string) => {
    window.$message.success(msg, {
        closable: true,
        duration: 5000,
    })
}
export const windowWarningMessage = (msg: string) => {
    window.$message.warning(msg, {
        closable: true,
        duration: 5000,
    })
}
export const windowInfoMessage = (msg: string) => {
    window.$message.info(msg, {
        closable: true,
        duration: 5000,
    })
}
