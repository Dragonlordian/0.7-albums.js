const Album = require('./albumVerif');
const mongoose = require('mongoose');
const AppError = require('./appError');

const getAllAlbums = async (req, res) => {
    const { sortField, sortOrder, fields, startYear, endYear, search } = req.query;
    let query = Album.find();
    if (startYear || endYear) {
        query = query.where('year');
        if (startYear) query = query.gte(startYear);
        if (endYear) query = query.lte(endYear);
    }

    if (search) {
        const regex = new RegExp(search, 'i');
        query = query.or([{ title: regex }, { artist: regex }]);
    }

    if (sortField && sortOrder) {
        const sortOptions = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
        query = query.sort(sortOptions);
    }

    if (fields) {
        query = query.select(fields.split(',').join(' '));
    }

    const albums = await query.exec();
    res.json(albums);
};

const getAlbumById = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    const error = new Error('Invalid ID format');
    error.name = 'CastError'; 
    return next(error); 
  }

  const album = await Album.findById(id);
  if (!album) {
    return res.status(404).json({ message: 'Album not found' });
  }
  res.json(album);
};

const createAlbum = async (req, res, next) => {
  try {
      const album = new Album({
          ...req.body,
          userId: req.user.id, // Save the owner’s ID to the album
      });
      await album.save();
      res.status(201).json(album);
  } catch (error) {
    console.log(error)
    next(new AppError('Error creating album', 500));
  }
};


const updateAlbum = async (req, res, next) => {
        const album = await Album.findById(req.params.id);
        if (!album) {
            return next(new AppError('Album not found', 400));
            //return res.status(404).send('Album not found');
        }
        Object.assign(album, req.body);

        await album.validate();
        const updatedAlbum = await album.save();
        res.json(updatedAlbum);
};

const deleteAlbum = async (req, res, next) => {
        const album = await Album.findByIdAndDelete(req.params.id);
        if (!album) {
          return next(new AppError('Album not found', 400));
            //return res.status(404).send('Album not found');
        }
        res.json(album);
};

module.exports = {
    getAllAlbums,
    getAlbumById,
    createAlbum,
    updateAlbum,
    deleteAlbum,
};