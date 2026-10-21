import sys, os
from rembg import remove, new_session
from PIL import Image, ImageFilter
sess = new_session(sys.argv[1])
for src in sys.argv[3:]:
    im = Image.open(src).convert("RGB")
    out = remove(im, session=sess, post_process_mask=True)
    bb = out.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    out = out.crop(bb)
    name = os.path.splitext(os.path.basename(src))[0]
    out.save(os.path.join(sys.argv[2], name + ".png"))
    print(name, out.size)
