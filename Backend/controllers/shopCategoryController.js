const ShopCategory = require('../models/ShopCategory');

exports.getCategories = async (req, res) => {
  try {
    const categories = await ShopCategory.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: 'shopproducts',
          localField: '_id',
          foreignField: 'category',
          as: 'products'
        }
      },
      {
        $addFields: {
          productsCount: { $size: '$products' }
        }
      },
      { $project: { products: 0 } }
    ]);

    // Convert to plain objects if not already (aggregate returns POJOs)
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await ShopCategory.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await ShopCategory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await ShopCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
