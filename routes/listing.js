get = (req, res, next) => {
  var query;
  if (req.query.type) {
    query = req.models.Listing.find({ type: req.query.type })
  } else {
    query = req.models.Listing.find()
  }
  query.exec().then((listings) => {
      return res.send(listings);
    }).catch((error) => {
      next(error)
    })
}

getById = (req, res, next) => {
  req.models.Listing.findById(req.params.id).then((listing) => {
    return res.send(listing)
  }).catch((error) => {
    next(error)
  })
}

post = (req, res, next) => {
  req.models.Listing.create({
    type: req.body.type,
    address: {
        street: req.body.address.street,
        streetNumber: req.body.address.streetNumber,
        municipality: req.body.address.municipality,
        geo: {
            lat: req.body.address.geo.lat,
            long: req.body.address.geo.long
        },
    },
    price: req.body.price,
    monthlyFee: req.body.monthlyFee,
    activeBidding: req.body.activeBidding
  }).then((listing) => {
    return res.status(201).send(listing)
  }).catch((error) => {
    next(error)
  })
}

put = (req, res, next) => {
  req.models.Listing.updateOne({ _id: req.params.id }, {
    type: req.body.type,
    address: {
        street: req.body.address.street,
        streetNumber: req.body.address.streetNumber,
        municipality: req.body.address.municipality,
        geo: {
            lat: req.body.address.geo.lat,
            long: req.body.address.geo.long
        },
    },
    price: req.body.price,
    monthlyFee: req.body.monthlyFee,
    activeBidding: req.body.activeBidding    
  }, {
    new: true,
    upsert: true,
    runvalidators: true,
  }).then((status) => {
    if (status.upserted)
      res.status(201)
    else if (status.nModified)
      res.status(200)
    else 
      res.status(204)
    res.send()
  }).catch((error) => {
    next(error)
  })
}

deleteListing = (req, res, next) => {
  req.models.Listing.findByIdAndDelete(
    req.params.id
  ).then((listing) => {
    if (listing)
      return res.status(200).send(`${listing.address.street} has been deleted`)
    res.sendStatus(204)
  }).catch((error) => {
    next(error)
  })
}

module.exports = {
  get,
  getById,
  post,
  put,
  deleteListing,
}