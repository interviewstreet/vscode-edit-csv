import * as vscode from 'vscode';
import { openCsvEditorForDocument } from './extension';

const getSpinnerHtml = () => {
	return `
			  <!DOCTYPE html>
			  <html>
			  <head>
				  <style>
					  body {
						  display: flex;
						  justify-content: center;
						  align-items: center;
						  height: 100vh;
						  margin: 0;
						  font-family: var(--vscode-font-family);
						  color: var(--vscode-foreground);
						  background: var(--vscode-editor-background);
					  }
					  .loader-container {
						  text-align: center;
					  }
					  .spinner {
						  border: 3px solid transparent;
						  border-top: 3px solid var(--vscode-progressBar-background, #0078d4);
						  border-right: 3px solid var(--vscode-progressBar-background, #0078d4);
						  border-radius: 50%;
						  width: 48px;
						  height: 48px;
						  animation: spin 0.8s linear infinite;
						  margin: 0 auto 24px;
					  }
					  @keyframes spin {
						  0% { transform: rotate(0deg); }
						  100% { transform: rotate(360deg); }
					  }
					  .message {
						  font-size: 13px;
						  font-weight: 400;
						  color: var(--vscode-foreground);
						  opacity: 0.85;
					  }
				  </style>
			  </head>
			  <body>
				  <div class="loader-container">
					  <div class="spinner"></div>
					  <div class="message">Loading CSV...</div>
				  </div>
			  </body>
			  </html>
		  `;
  };

/**
 * A simple custom editor provider that auto-opens the CSV table editor.
 * This directly calls the editor creation function without needing activeTextEditor.
 */
export class CsvAutoOpenProvider implements vscode.CustomReadonlyEditorProvider {

	/**
	 * Called when a CSV file is opened.
	 */
	async openCustomDocument(
		uri: vscode.Uri,
		openContext: vscode.CustomDocumentOpenContext,
		token: vscode.CancellationToken
	): Promise<vscode.CustomDocument> {
		// Return a minimal document
		return {
			uri,
			dispose: () => {}
		};
	}

	/**
	 * Called to render the custom editor.
	 * We pass the panel to the table editor to reuse it (no flicker!)
	 */
	async resolveCustomEditor(
		document: vscode.CustomDocument,
		webviewPanel: vscode.WebviewPanel,
		token: vscode.CancellationToken
	): Promise<void> {
		// Show loading spinner while we prepare the table editor
		webviewPanel.webview.html = getSpinnerHtml();

		// // Load the document and open the table editor
		const textDocument = await vscode.workspace.openTextDocument(document.uri);
		
		// // Pass the panel to reuse it
		// // If editor already exists, it will be revealed and this panel disposed
		// // If new editor created, it will reuse this panel
		openCsvEditorForDocument(textDocument, null, webviewPanel);
	}
}