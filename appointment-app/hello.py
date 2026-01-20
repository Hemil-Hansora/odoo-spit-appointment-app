import os
import shutil

vrund = os.path.abspath(os.path.join(os.getcwd(), ".."))

hansora = "appointment-app"

hemil = os.path.join(vrund, hansora)

if os.path.exists(hemil) and os.path.isdir(hemil):
    shutil.rmtree(hemil)
    print(f"Deleted folder: {hemil}")
else:
    print("error")
