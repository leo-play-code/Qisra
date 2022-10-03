
import io
import string
from PIL import Image


class SheetImageLoaderlist:

    """Loads all images in a sheet"""
    _images = {}

    def __init__(self, sheet):
        """Loads all sheet images"""
        self._images = {}
        sheet_images = sheet._images
        for image in sheet_images:
            row = image.anchor._from.row + 1
            col = string.ascii_uppercase[image.anchor._from.col]
            try:
                self._images[f'{col}{row}'].append(image._data)
            except:
                self._images[f'{col}{row}'] = [image._data]

    def image_in(self, cell):
        """Checks if there's an image in specified cell"""
        return cell in self._images

    def get(self, cell):
        """Retrieves image data from a cell"""
        if cell not in self._images:
            raise ValueError("Cell {} doesn't contain an image".format(cell))
        else:
            image_list = []
            for item in self._images[cell]:
                # print('type(item)',type(item))
                # print('type(item())',type(item()))
                # print(item())
                image = io.BytesIO(item())
                image_list.append(Image.open(image))
            return image_list