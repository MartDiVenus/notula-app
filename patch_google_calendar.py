import re

with open('src/utils/googleCalendar.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the end of syncMemoToGoogleCalendar
old_end = '''    if (!response.ok) {
      console.error('Failed to sync event to Google Calendar', await response.text());
      return null;
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    return null;
  }
}'''

new_end = '''    if (!response.ok) {
      const errText = await response.text();
      console.error('Failed to sync event to Google Calendar', errText);
      throw new Error(`Google Calendar API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    return data.id;
  } catch (error) {
    console.error('Error syncing to Google Calendar:', error);
    throw error;
  }
}'''

content = content.replace(old_end, new_end)

with open('src/utils/googleCalendar.ts', 'w', encoding='utf-8') as f:
    f.write(content)
