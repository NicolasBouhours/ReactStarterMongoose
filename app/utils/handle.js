exports.handleError = (res, message, err) => {
  console.log(err)
  if (err) {
    err = err.toString()
  }
  res.json({ success: false, message, err })
}

exports.handleSuccess = (res, message, result) => {
  res.json({ sucess: true, message, result })
}
