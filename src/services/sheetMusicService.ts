import { SheetMusicItem } from '../types/index'
import { apiRequest, uploadFile, ApiError } from '../config/api'

/**
 * Saves a new sheet music item with PDF file to the server
 */
export const saveSheetMusic = async (userId: string, item: SheetMusicItem, pdfFile: File) => {
  try {
    const formData = new FormData()
    formData.append('pdfFile', pdfFile)
    formData.append('id', item.id)
    formData.append('title', item.title)
    formData.append('composer', item.composer)
    formData.append('isFavorite', String(item.isFavorite))
    formData.append('dateAdded', item.dateAdded.toISOString())
    
    const result = await uploadFile<{pdfPath: string}>(`/sheet-music/${userId}`, formData)
    return result.pdfPath
  } catch (error) {
    console.error('Error saving sheet music:', error)
    if (error instanceof ApiError && error.isConnectionError) {
      throw new ApiError('Unable to upload sheet music.', 0, true)
    }
    throw error
  }
}

/**
 * Fetches all sheet music for a user
 */
export const getUserSheetMusic = async (userId: string): Promise<SheetMusicItem[]> => {
  try {
    const data = await apiRequest<SheetMusicItem[]>(`/sheet-music/${userId}`)
    
    if (!data || data.length === 0) {
      return []
    }

    return data.map(item => ({
      ...item,
      dateAdded: new Date(item.dateAdded)
    }))
  } catch (error) {
    console.error('Error getting user sheet music:', error)
    if (error instanceof ApiError && error.isConnectionError) {
      throw new ApiError('Unable to load your sheet music library.', 0, true)
    }
    throw error
  }
}

/**
 * Updates an existing sheet music item
 */
export const updateSheetMusic = async (
  userId: string, 
  itemId: string, 
  updates: Partial<SheetMusicItem>
) => {
  try {
    await apiRequest(`/sheet-music/${userId}/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updates.title,
        composer: updates.composer,
        isFavorite: updates.isFavorite
      })
    })
  } catch (error) {
    console.error('Error updating sheet music:', error)
    if (error instanceof ApiError && error.isConnectionError) {
      throw new ApiError('Unable to update sheet music.', 0, true)
    }
    throw error
  }
}

/**
 * Deletes a sheet music item
 */
export const deleteSheetMusic = async (userId: string, itemId: string) => {
  try {
    await apiRequest(`/sheet-music/${userId}/${itemId}`, {
      method: 'DELETE'
    })
  } catch (error) {
    console.error('Error deleting sheet music:', error)
    if (error instanceof ApiError && error.isConnectionError) {
      throw new ApiError('Unable to delete sheet music.', 0, true)
    }
    throw error
  }
}

/**
 * Alias for getUserSheetMusic for legacy compatibility
 */
export const fetchSheetMusic = async (userId: string): Promise<SheetMusicItem[]> => {
  return getUserSheetMusic(userId);
} 