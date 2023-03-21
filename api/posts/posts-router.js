// posts için gerekli routerları buraya yazın

const posts_model = require("./posts-model");
const router = require("express").Router();

router.get("/", async (req, res) => {
  try {
    let posts = await posts_model.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Gönderiler alınamadı" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let id = await posts_model.findById(req.params.id);
    if (!id) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      res.status(200).json(id);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgisi alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    let post = req.body;
    if (!post.title || !post.contents) {
      res.status(400).json({
        message: "Lütfen gönderi için bir title ve contents sağlayın",
      });
    } else {
      let ınsertpostID = await posts_model.insert(post);
      let ınsertpost = await posts_model.findById(ınsertpostID.id);
      res.status(201).json(ınsertpost);
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Veritabanına kaydedilirken bir hata oluştu" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    let id = await posts_model.findById(req.params.id);
    if (!id) {
      res.status(404).json({ message: "Belirtilen ID'li gönderi bulunamadı" });
    } else {
      let post = req.body;
      if (!post.title || !post.contents) {
        res
          .status(400)
          .json({ message: "Lütfen gönderi için title ve contents sağlayın" });
      } else {
        await posts_model.update(req.params.id, post);
        let updatepost = await posts_model.findById(req.params.id);
        res.status(200).json(updatepost);
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi bilgileri güncellenemedi" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let id = await posts_model.findById(req.params.id);
    if (!id) {
      res.status(404).json({ message: "Belirtilen ID li gönderi bulunamadı" });
    } else {
      let deletePost = await posts_model.findById(req.params.id);
      await posts_model.remove(req.params.id);
      res.status(200).json(deletePost);
    }
  } catch (error) {
    res.status(500).json({ message: "Gönderi silinemedi" });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    let id = await posts_model.findCommentById(req.params.id);
    if (!id) {
      res.status(404).json({ message: "Girilen ID'li gönderi bulunamadı." });
    } else {
      let comment = await posts_model.findPostComments(req.params.id);
      res.status(200).json(comment);
    }
  } catch (error) {
    res.status(500).json({ message: "Yorumlar bilgisi getirilemedi" });
  }
});

module.exports = router;
